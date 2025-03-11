"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import emailjs from "emailjs-com";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Building2, Mail, Phone, Clock } from "lucide-react";
import { useEffect } from "react";
import { Container, Wrapper } from "@/components";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { subject } from "@/constants";

const formSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().min(2).max(255),
  message: z.string(),
});

export const ContactSection = () => {
  const t = useTranslations("contact");
  const locale = useParams()?.locale as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: t("subject_menu.web_development.subject"),
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { firstName, lastName, email, subject, message } = values;

    const templateParams = {
      firstName,
      lastName,
      email,
      subject,
      message,
    };

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response);
          alert("Your message has been sent!");
        },
        (error) => {
          console.log("Error sending email:", error);
          alert("Failed to send the message. Please try again.");
        }
      );
  }

  const localizedHref = (path: string) => `/${locale}${path}`;

  return (
    <Wrapper>
      <Container>
        <section id="contact" className="container">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4" data-aos="fade-up" data-aos-delay="500">
                <h2 className="text-lg text-primary mb-2 tracking-wider">
                  {t("badge")}
                </h2>

                <h2 className="text-3xl md:text-4xl font-bold">{t("title")}</h2>
              </div>
              <p
                className="mb-8 text-muted-foreground lg:w-5/6"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                {t("description")}
              </p>

              <div className="flex flex-col gap-4">
                <div
                  className="border rounded-2xl p-6"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <div className="flex gap-2 mb-1">
                    <Building2 />
                    <div className="font-bold"> {t("address")}</div>
                  </div>

                  <div>742 Evergreen Terrace, Springfield, IL 16720</div>
                </div>

                <div
                  className="border rounded-2xl p-6"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <div className="flex gap-2 mb-1">
                    <Phone />
                    <div className="font-bold"> {t("call")}</div>
                  </div>

                  <div>(+62) 831-37-991-102</div>
                </div>

                <div
                  className="border rounded-2xl p-6"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <div className="flex gap-2 mb-1">
                    <Mail />
                    <div className="font-bold"> {t("mail")}</div>
                  </div>

                  <div>cvcoders.id @gmail.com</div>
                </div>

                <div
                  className="border rounded-2xl p-6"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <div className="flex gap-2">
                    <Clock />
                    <div className="font-bold"> {t("visit")}</div>
                  </div>

                  <div>
                    <div>Senin - Minggu</div>
                    <div>8AM - 4PM</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-muted/60 dark:bg-card">
              <CardHeader className="text-primary text-2xl"> </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid w-full gap-4"
                  >
                    <div className="flex flex-col md:!flex-row gap-8">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem
                            className="w-full"
                            data-aos="fade-up"
                            data-aos-delay="500"
                          >
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Name First" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem
                            className="w-full"
                            data-aos="fade-up"
                            data-aos-delay="500"
                          >
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Name Last" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div
                      className="flex flex-col gap-1.5"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Your Email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div
                      className="flex flex-col gap-1.5"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subject.map((subject) => {
                                  const translationKey = `subject_menu.${subject.titleKey.toLowerCase().replace(/ /g, "_")}.subject`;
                                  return (
                                    <SelectItem 
                                      value={t(translationKey)} 
                                      key={subject.titleKey}
                                    >
                                      {t(translationKey)}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div
                      className="flex flex-col gap-1.5"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={5}
                                placeholder="Your message..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      className="mt-4"
                      data-aos="fade-up"
                      data-aos-delay="500"
                      variant="default"
                    >
                      Send message
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </section>
        </section>
      </Container>
    </Wrapper>
  );
};
